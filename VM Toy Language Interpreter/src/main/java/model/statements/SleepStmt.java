package model.statements;

import exceptions.GeneralException;
import model.state.PrgState;
import model.adt.MyIDictionary;
import model.adt.MyIStack;
import model.type.IType;

public class SleepStmt implements IStatement{
    int number;
    public SleepStmt(int number){
        this.number = number;
    }

    @Override
    public PrgState execute(PrgState state) throws GeneralException {
        if(number > 0){
            state.getExecStack().push(new SleepStmt(number - 1));
        }
        return null;
    }

    @Override
    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnv) throws GeneralException {
        return typeEnv;
    }

    @Override
    public IStatement deepCopy() {
        return new SleepStmt(number);
    }

    @Override
    public String toString() {
        return "sleep(" + number + ")";
    }
}
