package model.statements;

import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.state.PrgState;
import model.type.IType;

public class CompStatement implements IStatement{
    private final IStatement first;
    private final IStatement second;

    public CompStatement(IStatement first, IStatement second){
        this.first = first;
        this.second = second;
    }

    @Override
    public PrgState execute(PrgState state){
        state.getExecStack().push(this.second);
        state.getExecStack().push(this.first);
        return null;
    }

    @Override
    public String toString(){
        return "(" + this.first + "; " + this.second + ")";
    }

    public IStatement deepCopy(){
        return new CompStatement(this.first.deepCopy(), this.second.deepCopy());
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        return this.second.typeCheck(this.first.typeCheck(typeEnvironment));
    }
}
