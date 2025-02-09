package model.statements;

import exceptions.GeneralException;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.expressions.NotExpression;
import model.state.PrgState;
import model.type.BoolType;
import model.type.IType;

public class RepeatUntilStmt implements IStatement{
    IExpression expression;
    IStatement statement;

    public RepeatUntilStmt(IStatement statement, IExpression expression ){
        this.statement = statement;
        this.expression = expression;
    }

    @Override
    public PrgState execute(PrgState state) throws GeneralException {
        IStatement newStmt = new CompStatement(statement, new WhileStatement(new NotExpression(expression), statement));
        state.getExecStack().push(newStmt);
        return null;
    }

    @Override
    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnv) throws GeneralException {
            IType type = expression.typeCheck(typeEnv);
        if (type.equals(new BoolType())) {
            statement.typeCheck(typeEnv.copy());
            return typeEnv;
        } else {
            throw new GeneralException("RepeatUntilStmt: Expression must be bool type!");
        }
    }

    @Override
    public IStatement deepCopy() {
        return new RepeatUntilStmt(statement.deepCopy(), expression.deepCopy());
    }

    @Override
    public String toString() {
        return "repeat{ " + statement + " } until " + expression;
    }
}
