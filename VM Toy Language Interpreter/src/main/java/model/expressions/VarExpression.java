package model.expressions;

import model.adt.MyIDictionary;
import model.adt.MyIHeap;
import model.type.IType;
import model.value.IValue;

public class VarExpression implements IExpression{
    private final String variable;

    public VarExpression(String variable){
        this.variable = variable;
    }

    @Override
    public IValue evaluate(MyIDictionary<String, IValue> symTable, MyIHeap heap) {
        return symTable.get(variable);
    }

    @Override
    public String toString(){
        return this.variable;
    }

    public IExpression deepCopy(){
        return new VarExpression(this.variable);
    }

    public IType typeCheck(MyIDictionary<String, IType> typeEnvironment) {
        return typeEnvironment.get(variable);
    }
}
