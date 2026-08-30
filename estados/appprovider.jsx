import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedIfNeeded } from "../utils/seed";
import {
  addItem,
  getAllItems,
  getItem,
  removeItem,
  updateItem,
} from "../utils/storageDb";
import {
  calculatePotionAndResultsOnClose,
  getVotingStatus,
} from "../utils/calcPotion";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);


  const [users, setUsers] = useState([]);
  const [guilds, setGuilds] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [votes, setVotes] = useState([]);
  const [results, setResults] = useState([]);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {

    seedIfNeeded();


    refreshAll();
    setReady(true);

    const raw = localStorage.getItem("alch_sessionUserId");
    if (raw) {
      const u = getItem("users", raw);
      if (u) setSessionUser(u);
    }
   
  }, []);

  function refreshAll() {
    setUsers(getAllItems("users"));
    setGuilds(getAllItems("guilds"));
    setFormulas(getAllItems("formulas"));
    setVotes(getAllItems("votes"));
    setResults(getAllItems("results"));
    setRankings(getAllItems("rankings"));
  }

  const api = useMemo(() => {
    const ensureUser = () => {
      if (!sessionUser) throw new Error("Not authenticated");
      return sessionUser;
    };

    const requireAuthForCreate = () => {
      ensureUser();
    };

    const login = (userId) => {
      const u = getItem("users", userId);
      if (!u) throw new Error("User not found");
      setSessionUser(u);
      localStorage.setItem("alch_sessionUserId", u.id);
      return true;
    };

    const logout = () => {
      setSessionUser(null);
      localStorage.removeItem("alch_sessionUserId");
    };

    const createGuild = ({ name, description }) => {
      requireAuthForCreate();
      const created = addItem("guilds", {
        name,
        description,
        createdAt: Date.now(),
      });
      refreshAll();
      return created;
    };

    const createFormula = ({
      guildId,
      name,
      method, 
      ingredientIds, 
      jar, 
      createdByUserId, 
    }) => {
      requireAuthForCreate();
      const status = getVotingStatus({ formulas, formulaId: undefined });

      const created = addItem("formulas", {
        guildId,
        name,
        method,
        ingredientIds,
        jar,
        createdByUserId,
        createdAt: Date.now(),
        closedAt: null,
      });

      refreshAll();
      return created;
    };

    const upsertVote = ({ formulaId, method, category, choice, voterUserId }) => {

      requireAuthForCreate();

      const formula = getItem("formulas", formulaId);
      if (!formula) throw new Error("Formula not found");

      if (formula.closedAt) {
        throw new Error("Voting closed");
      }

      const existing = getAllItems("votes").find(
        (v) => v.formulaId === formulaId && v.method === method && v.voterUserId === voterUserId
      );

      if (existing) {
        const updated = updateItem("votes", existing.id, { choice });
        refreshAll();
        return updated;
      }

      const created = addItem("votes", {
        formulaId,
        method,
        category, 
        choice, 
        voterUserId,
        createdAt: Date.now(),
      });

      refreshAll();
      return created;
    };

    const closeVoting = ({ formulaId, closedByUserId }) => {
      requireAuthForCreate();

      const formula = getItem("formulas", formulaId);
      if (!formula) throw new Error("Formula not found");

      if (formula.closedAt) {
        throw new Error("Voting already closed");
      }

      const computed = calculatePotionAndResultsOnClose({
        formulaId,
        now: Date.now(),
      });

      updateItem("formulas", formulaId, { closedAt: Date.now() });

      refreshAll();

      return computed;
    };

    const removeGuild = (guildId) => {
      requireAuthForCreate();
      removeItem("guilds", guildId);
      refreshAll();
    };

    const listForVoting = (formulaId) => {
      const formula = getItem("formulas", formulaId);
      const formulaVotes = getAllItems("votes").filter((v) => v.formulaId === formulaId);
      return { formula, formulaVotes };
    };

    return {
      ready,
      sessionUser,


      login,
      logout,

      users,
      guilds,
      formulas,
      votes,
      results,
      rankings,

      refreshAll,
      createGuild,
      createFormula,

      upsertVote,

      closeVoting,

      listForVoting,
    };
  }, [formulas, rankings, results, sessionUser, votes, guilds, users]);

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}