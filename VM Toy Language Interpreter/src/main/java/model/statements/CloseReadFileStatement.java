package model.statements;

import exceptions.ExpressionException;
import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.state.PrgState;
import model.type.IType;
import model.type.StringType;
import model.value.IValue;
import model.value.StringValue;

import java.io.BufferedReader;
import java.io.IOException;

public class CloseReadFileStatement implements IStatement {
    private final IExpression expression;

    public CloseReadFileStatement(IExpression expression) {
        this.expression = expression;
    }

    @Override
    public PrgState execute(PrgState state) throws StatementException, ExpressionException {
        IValue value = expression.evaluate(state.getSymTable(), state.getHeap());
        if (!value.getType().equals(new StringType())) {
            throw new StatementException(String.format("Close Read File Error: %s is not of type string.", expression));
        }

        StringValue fileName = (StringValue) value;
        MyIDictionary<String, BufferedReader> fileTable = state.getFileTable();

        BufferedReader bufferedReader = fileTable.get(String.valueOf(fileName));
        try {
            bufferedReader.close();
        } catch (IOException e) {
            throw new StatementException(String.format("Close Read File Error: File %s could not be closed.", value));
        }

        fileTable.remove(String.valueOf(fileName));

        return null;
    }

    @Override
    public String toString() {
        return String.format("CloseReadFile(%s)", expression);
    }

    @Override
    public IStatement deepCopy() {
        return new CloseReadFileStatement(expression);
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        IType type = expression.typeCheck(typeEnvironment);
        if (!type.equals(new StringType())) {
            throw new StatementException("Close Read File Error: Expression is not of type string.");
        }
        return typeEnvironment;
    }
}