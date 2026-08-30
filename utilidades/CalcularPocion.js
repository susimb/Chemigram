import { getAllItems, getItem, addItem, updateItem } from "./storageDb";
import { INGREDIENTS, METHODS } from "./constants";

const OFFICIAL_ROLE = "OFFICIAL";
const rarityByPoints = {
  10: "Común",
  25: "Rara",
  50: "Épica",
  100: "Legendaria",
};

function pointsFromWeightedVotes(totalWeighted) {
  if (totalWeighted >= 8) return 100;
  if (totalWeighted >= 5) return 50;
  if (totalWeighted >= 2) return 25;
  return 10;
}

export function getVotingStatus({ formulas, formulaId }) {
  const f = formulas.find((x) => x.id === formulaId);
  return { closed: !!f?.closedAt };
}

function getOfficialWeight(user) {
  return user?.role === OFFICIAL_ROLE ? 2 : 1;
}

function computeMethodWinners(formulaId) {
  const votes = getAllItems("votes").filter((v) => v.formulaId === formulaId);
  const users = getAllItems("users");

  const acc = {};
  METHODS.forEach((m) => {
    acc[m] = 0;
  });

  for (const v of votes) {
    const voter = users.find((u) => u.id === v.voterUserId);
    const weight = getOfficialWeight(voter);
    const method = v.method; 
    if (!acc[method]) acc[method] = 0;
    acc[method] += weight;
  }

  const entries = Object.entries(acc);
  entries.sort((a, b) => b[1] - a[1]);

  const winner = entries[0] || [METHODS[0], 0];
  const winnerMethod = winner[0];
  const winnerWeightedVotes = winner[1];

  return {
    accByMethod: acc,
    winnerMethod,
    winnerWeightedVotes,
  };
}

export function calculatePotionAndResultsOnClose({ formulaId, now = Date.now() }) {
  const formula = getItem("formulas", formulaId);
  if (!formula) throw new Error("Formula not found");

  const creatorId = formula.createdByUserId;

  const { accByMethod, winnerMethod, winnerWeightedVotes } = computeMethodWinners(formulaId);

  const points = pointsFromWeightedVotes(winnerWeightedVotes);
  const rarity = rarityByPoints[points] || "Común";

  const result = addItem("results", {
    formulaId,
    methodWinner: winnerMethod,
    weightedVotesByMethod: accByMethod,
    winnerWeightedVotes,
    pointsAwarded: points,
    rarity,
    createdAt: now,
  });

  const rankings = getAllItems("rankings");
  const existing = rankings.find((r) => r.userId === creatorId);

  const delta = points;

  if (existing) {
    updateItem("rankings", existing.id, {
      totalPoints: (existing.totalPoints || 0) + delta,
      updatedAt: now,
    });
  } else {
    addItem("rankings", {
      userId: creatorId,
      totalPoints: delta,
      createdAt: now,
      updatedAt: now,
    });
  }

  return {
    result,
    winnerMethod,
    winnerWeightedVotes,
    points,
    rarity,
  };
}
