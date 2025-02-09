package model.statements;

import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.state.PrgState;
import model.type.IType;
import model.value.IValue;

public class PrintStatement implements IStatement{
    private final IExpression expression;

    public PrintStatement(IExpression expression){
        this.expression = expression;
    }

    @Override
    public PrgState execute(PrgState state){
        IValue val = expression.evaluate(state.getSymTable(), state.getHeap());
        state.getOutputList().add(val.toString());
        return null;
    }

    @Override
    public String toString(){
        return ("print(" + expression.toString() + ")");
    }

    public IStatement deepCopy(){
        return new PrintStatement(expression.deepCopy());
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        expression.typeCheck(typeEnvironment);
        return typeEnvironment;
    }
}
