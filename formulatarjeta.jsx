import Card from "../common/Card";
import Badge from "../common/Badge";

function FormulaCard({ formula }) {

    return (
        <Card title={formula.name}>

            <p>
                {formula.desiredEffect}
            </p>

            <Badge type="status">
                {formula.status}
            </Badge>

            <div>
                <strong>Ingrediente:</strong>
                <p>{formula.ingredient}</p>
            </div>

            <div>
                <strong>Método:</strong>
                <p>{formula.method}</p>
            </div>

            <div>
                <strong>Frasco:</strong>
                <p>{formula.flask}</p>
            </div>

        </Card>
    );
}

export default FormulaCard;