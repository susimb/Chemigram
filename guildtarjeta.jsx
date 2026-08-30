import Card from "../common/Card";
import Badge from "../common/Badge";

function GuildCard({ guild }) {

    return (
        <Card title={guild.name}>

            <p>{guild.motto}</p>

            <Badge type={guild.type.toLowerCase()}>
                {guild.type}
            </Badge>

            <p>
                Miembros: {guild.members}
            </p>

        </Card>
    );
}

export default GuildCard;