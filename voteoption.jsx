function VoteOption({
    name,
    votes,
    percentage,
    selected,
    onSelect
}) {

    return (
        <div className="vote-option">

            <label>
                <input
                    type="radio"
                    checked={selected}
                    onChange={onSelect}
                />

                {name}
            </label>

            <span>
                {votes} votos ({percentage}%)
            </span>

        </div>
    );
}

export default VoteOption;