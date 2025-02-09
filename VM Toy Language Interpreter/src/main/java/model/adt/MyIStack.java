package model.adt;

import exceptions.EmptyStackException;
import view.commands.Command;

public interface MyIStack<T> {
    T pop() throws EmptyStackException;
    void push(T t);
    boolean isEmpty();
    int size();

    Command[] values();
}
