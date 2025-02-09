package model.statements;

import exceptions.GeneralException;
import model.state.PrgState;
import model.adt.MyIDictionary;
import model.adt.MyIStack;
import model.expressions.ValueExpression;
import model.type.IType;
import model.value.IntValue;

public class WaitStmt implements IStatement{
    int number;
    public WaitStmt(int number){
        this.number = number;
    }

    @Override
    public PrgState execute(PrgState state) throws GeneralException {
        if(number > 0){
            state.getExecStack().push(new CompStatement(new PrintStatement(new ValueExpression(new IntValue(number))), new WaitStmt(number - 1)));
        }
        return null;
    }

    @Override
    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnv) throws GeneralException {
        return typeEnv;
    }

    @Override
    public IStatement deepCopy() {
        return new WaitStmt(number);
    }

    @Override
    public String toString() {
        return "wait(" + number + ")";
    }
}
