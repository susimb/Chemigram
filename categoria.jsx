import VoteOption from "./VoteOption";

function VotingCategory({
    title,
    options,
    selected,
    onSelect
}) {

    return (
        <div className="voting-category">

            <h3>{title}</h3>

            {options.map(option => (
                <VoteOption
                    key={option.id}
                    name={option.name}
                    votes={option.votes}
                    percentage={option.percentage}
                    selected={selected === option.id}
                    onSelect={() => onSelect(option.id)}
                />
            ))}

        </div>
    );
}

export default VotingCategory;