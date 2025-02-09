package model.statements;

import exceptions.ExpressionException;
import exceptions.StatementException;
import model.state.PrgState;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.type.IType;
import model.type.StringType;
import model.value.IValue;
import model.value.StringValue;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;


public class OpenReadFileStatement implements IStatement{
    private final IExpression expression;

    public OpenReadFileStatement(IExpression expression) {
        this.expression = expression;
    }

    @Override
    public PrgState execute(PrgState state) throws StatementException, ExpressionException {
        IValue value = expression.evaluate(state.getSymTable(), state.getHeap());

        if (!value.getType().equals(new StringType())) {
            throw new StatementException(String.format("Open Read File Error: %s is not of type string.", expression));
        }

        StringValue fileName = (StringValue) value;

        MyIDictionary<String, BufferedReader> fileTable = state.getFileTable();
        if (fileTable.containsKey(fileName)) {
            throw new StatementException(String.format("Open Read File Error: File %s is already open.", fileName));
        }

        BufferedReader bufferedReader;
        try {
            bufferedReader = new BufferedReader(new FileReader(String.valueOf(fileName.getValue())));
        } catch (IOException e) {
            throw new StatementException(String.format("Open Read File Error: File %s could not be open.", fileName));
        }

        fileTable.insert(String.valueOf(fileName), bufferedReader);

        return null;
    }

    @Override
    public String toString() {
        return String.format("OpenReadFile(%s)", expression);
    }

    @Override
    public IStatement deepCopy() {
        return new OpenReadFileStatement(expression);
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        IType type = expression.typeCheck(typeEnvironment);
        if (!type.equals(new StringType())) {
            throw new StatementException("Open Read File Error: Expression is not of type string.");
        }
        return typeEnvironment;
    }
}
