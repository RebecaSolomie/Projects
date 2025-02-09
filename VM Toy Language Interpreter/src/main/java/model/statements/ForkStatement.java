package model.statements;

import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.adt.MyStack;
import model.state.PrgState;
import model.type.IType;

public class ForkStatement implements IStatement {
    private final IStatement statement;

    public ForkStatement(IStatement statement) {
        this.statement = statement;
    }

    @Override
    public PrgState execute(PrgState state) {
        MyStack<IStatement> newExecutionStack = new MyStack<>();
        newExecutionStack.push(statement);

        PrgState forkState = new PrgState(newExecutionStack, state.getSymTable().copy(),
                state.getOutputList(), state.getHeap(), state.getFileTable());
        return forkState;
    }

    @Override
    public IStatement deepCopy() {
        return new ForkStatement(statement.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("fork(%s)", statement);
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        return statement.typeCheck(typeEnvironment);
    }
}