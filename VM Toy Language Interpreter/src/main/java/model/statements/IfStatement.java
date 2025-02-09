package model.statements;

import exceptions.ExpressionException;
import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.state.PrgState;
import model.type.BoolType;
import model.type.IType;
import model.value.BoolValue;
import model.value.IValue;

public class IfStatement implements IStatement{
    private final IExpression condition;
    private final IStatement thenStatement;
    private final IStatement elseStatement;
    public IfStatement(IExpression condition, IStatement thenStatement, IStatement elseStatement) {
        this.condition = condition;
        this.thenStatement = thenStatement;
        this.elseStatement = elseStatement;
    }
    public PrgState execute(PrgState state) throws StatementException, ExpressionException {

        IValue val = condition.evaluate(state.getSymTable(), state.getHeap());
        if(!val.getType().equals(new BoolType())){
            throw new StatementException("The condition is not a boolean");
        }
        if(((BoolValue)val).getValue())
        {
            state.getExecStack().push(thenStatement);
        }
        else
            state.getExecStack().push(elseStatement);
        return null;
    }
    public String toString() {
        return "IF("+ condition.toString()+") THEN{" +thenStatement.toString() +"}ELSE{"+elseStatement.toString()+"}";
    }

    public IStatement deepCopy() {
        return new IfStatement(condition.deepCopy(), thenStatement.deepCopy(), elseStatement.deepCopy());
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        IType typeCondition = condition.typeCheck(typeEnvironment);
        if (!typeCondition.equals(new BoolType())) {
            throw new StatementException("If: condition is not a boolean!");
        }
        MyIDictionary<String, IType> typeThen = thenStatement.typeCheck(typeEnvironment);
        MyIDictionary<String, IType> typeElse = elseStatement.typeCheck(typeEnvironment);
        return typeThen;
    }
}
