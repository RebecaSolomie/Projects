package model.statements;

import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.state.PrgState;
import model.type.IType;

public interface IStatement {
    PrgState execute(PrgState state) throws StatementException;
    IStatement deepCopy();
    MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException;
}
