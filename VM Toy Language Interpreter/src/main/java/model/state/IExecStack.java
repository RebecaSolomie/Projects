package model.state;

import exceptions.EmptyStackException;
import model.statements.IStatement;

public interface IExecStack {
    public void push(IStatement statement);
    public IStatement pop() throws EmptyStackException;
    int size();
    boolean isEmpty();
}
