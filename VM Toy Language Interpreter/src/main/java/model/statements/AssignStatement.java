package model.statements;

import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.state.PrgState;
import model.type.IType;
import model.value.IValue;

public class AssignStatement implements IStatement{
    private final String id;
    private final IExpression expression;

    public AssignStatement(String id, IExpression expression){
        this.id = id;
        this.expression = expression;
    }

    @Override
    public String toString(){
        return id + " = " + expression;
    }

    @Override
    public PrgState execute(PrgState state) throws StatementException{
        if (!state.getSymTable().contains(id)){
            throw new StatementException("The variable was not declared previously!");
        }
        IValue val = expression.evaluate(state.getSymTable(), state.getHeap());
        if (val.getType().equals(state.getSymTable())) {
            throw new StatementException("The type did not match!");
        }
        state.getSymTable().insert(id, val);
        return null;
    }

    public IStatement deepCopy(){
        return new AssignStatement(id, expression.deepCopy());
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        IType typeVariable = typeEnvironment.get(id);
        IType typeExpression = expression.typeCheck(typeEnvironment);
        if (!typeVariable.equals(typeExpression)) {
            throw new StatementException("Assignment: right hand side and left hand side have different types!");
        }
        return typeEnvironment;
    }
}


