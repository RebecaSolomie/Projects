package model.adt;

import exceptions.EmptyStackException;
import view.commands.Command;

import java.util.Stack;

public class MyStack<T> implements MyIStack<T> {
    Stack<T> stack;
    public MyStack() {
        stack = new Stack<>();
    }

    @Override
    public T pop() throws EmptyStackException {
        if(stack.isEmpty()){
            throw new EmptyStackException("Stack is empty\n");
        }
        return this.stack.pop();
    }

    @Override
    public void push(T t) {
        this.stack.push(t);
    }

    @Override
    public boolean isEmpty() {
        return this.stack.isEmpty();
    }

    @Override
    public int size() {
        return this.stack.size();
    }

    @Override
    public Command[] values() {
        return new Command[0];
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder();

        for(T el: this.stack){
            str.append(el);
            str.append("\n");
        }


        return "Stack contains: " + str.toString();
    }
}
