package model.state;
import exceptions.EmptyStackException;
import exceptions.ExpressionException;
import exceptions.GeneralException;
import exceptions.StatementException;
import model.adt.*;
import model.statements.IStatement;
import model.value.IValue;

import java.io.BufferedReader;

public class PrgState {
    private final MyIStack<IStatement> execStack;
    private final MyIDictionary<String, IValue> symTable;
    private final MyIList<String> outputList;
    private final MyIHeap heap;
    private final MyIDictionary<String, BufferedReader> fileTable;

    public final Integer id;
    private static Integer lastId = 0;

    public PrgState(IStatement originalProgram) {
        execStack = new MyStack<>();
        symTable = new MyDictionary<>();
        outputList = new MyList<>();
        heap = new MyHeap();
        fileTable = new MyDictionary<>();
        id = setId();

        execStack.push(originalProgram);
    }

    public PrgState(MyIStack<IStatement> executionStack, MyIDictionary<String, IValue> symTable, MyIList<String> out,
                    MyIHeap heap, MyIDictionary<String, BufferedReader> fileTable) {
        this.execStack = executionStack;
        this.symTable = symTable;
        this.outputList = out;
        this.heap = heap;
        this.fileTable = fileTable;
        id = setId();
    }

    public MyIStack<IStatement> getExecStack() {
        return execStack;
    }

    public MyIDictionary<String, IValue> getSymTable() {
        return symTable;
    }

    public MyIList<String> getOutputList() {
        return outputList;
    }

    public MyIHeap getHeap() {
        return heap;
    }

    public MyIDictionary<String, BufferedReader> getFileTable() {
        return fileTable;
    }

    public synchronized int setId() {
        lastId++;
        return lastId;
    }

    public PrgState executeOneStep() throws StatementException, GeneralException, ExpressionException, EmptyStackException {
        if (execStack.isEmpty()) {
            throw new StatementException("Execution Stack Error: Execution stack is empty.");
        }
        IStatement currentStatement = execStack.pop();
        return currentStatement.execute(this);
    }

    public boolean isNotCompleted() {
        return !execStack.isEmpty();
    }

    @Override
    public String toString() {
        return "ID = " + this.id + "\n" + execStack.toString() + "\n" + symTable.toString() + "\n"
                + outputList.toString() + "\n" + toStringFile() + "\n" + heap.toString() + "\n";
    }

    public String toStringFile(){
        StringBuilder fileTableStringBuilder = new StringBuilder();
        for (String obj : fileTable.getKeys())
            fileTableStringBuilder.append(obj).append("\n");
        return fileTableStringBuilder.toString();
    }

    public Integer getId() {
        return this.id;
    }
}
