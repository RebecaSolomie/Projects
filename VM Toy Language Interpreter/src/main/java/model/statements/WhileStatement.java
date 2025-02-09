package model.statements;

import exceptions.ExpressionException;
import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.state.PrgState;
import model.type.BoolType;
import model.type.IType;
import model.value.BoolValue;
import model.value.IValue;

public class WhileStatement implements IStatement {
    private final IExpression expression;
    private final IStatement statement;

    public WhileStatement(IExpression expression, IStatement statement) {
        this.expression = expression;
        this.statement = statement;
    }

    @Override
    public PrgState execute(PrgState state) throws StatementException, ExpressionException {
        IValue value = expression.evaluate(state.getSymTable(), state.getHeap());
        if (!value.getType().equals(new BoolType())) {
            throw new StatementException(String.format("While Error: %s is not of type bool.", value));
        }

        BoolValue boolValue = (BoolValue) value;
        if (boolValue.getValue()) {
            state.getExecStack().push(this);
            state.getExecStack().push(statement);
        }

        return null;
    }

    @Override
    public IStatement deepCopy() {
        return new WhileStatement(expression.deepCopy(), statement.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("While(%s) {%s}", expression, statement);
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        IType expressionType = expression.typeCheck(typeEnvironment);
        if (!expressionType.equals(new BoolType())) {
            throw new StatementException("While: condition is not a boolean!");
        }
        statement.typeCheck(typeEnvironment);
        return typeEnvironment;
    }
}