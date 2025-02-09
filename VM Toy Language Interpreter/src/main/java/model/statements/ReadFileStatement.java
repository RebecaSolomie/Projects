package model.statements;

import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.state.PrgState;
import model.type.IType;
import model.type.IntType;
import model.type.StringType;
import model.value.IValue;
import model.value.IntValue;
import model.value.StringValue;

import java.io.BufferedReader;
import java.io.IOException;

public class ReadFileStatement implements IStatement{
    private final IExpression exp;
    private final String varName;

    public ReadFileStatement(IExpression exp, String varName) {
        this.exp = exp;
        this.varName = varName;
    }

    @Override
    public PrgState execute(PrgState state) throws StatementException{
        if (!state.getSymTable().contains(this.varName)) {
            throw new StatementException("Variable not found in symbol table");
        }
        if (!state.getSymTable().get(varName).getType() .equals(new IntType())) {
            throw new StatementException("Variable is not of type int");
        }
        IValue value = this.exp.evaluate(state.getSymTable(), state.getHeap());
        if (!value.getType().equals(new StringType())) {
            throw new StatementException("Expression is not of type string");
        }
        BufferedReader bufferedReader = state.getFileTable().get(String.valueOf((StringValue)value));
        try {
            String fileLine = bufferedReader.readLine();
            if (fileLine == null) {
                fileLine = "0";
            }
            int intFileLine = Integer.parseInt(fileLine);
            state.getSymTable().insert(this.varName, new IntValue(intFileLine));
        }
        catch (IOException e) {
            throw new StatementException("Error reading from file");
        }
        return null;
    }

    @Override
    public String toString() {
        return "ReadFile(" + this.exp.toString() + ", " + this.varName + ")";
    }

    @Override
    public IStatement deepCopy() {
        return new ReadFileStatement(this.exp, this.varName);
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        IType type = exp.typeCheck(typeEnvironment);
        if (!type.equals(new StringType())) {
            throw new StatementException("Read File Error: Expression is not of type string.");
        }
        return typeEnvironment;
    }
}
