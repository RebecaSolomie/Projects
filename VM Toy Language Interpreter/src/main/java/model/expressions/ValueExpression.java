package model.expressions;

import model.adt.MyIDictionary;
import model.adt.MyIHeap;
import model.state.PrgState;
import model.type.IType;
import model.value.IValue;

import java.beans.Expression;

public class ValueExpression implements IExpression {
    private IValue value;
    public ValueExpression(IValue value) {
        this.value = value;
    }

    @Override
    public IValue evaluate(MyIDictionary<String, IValue> symTable, MyIHeap heap) {
        return this.value;
    }

    @Override
    public String toString() {
        return this.value.toString();
    }

    public IExpression deepCopy() {
        return new ValueExpression(this.value);
    }

    public IType typeCheck(MyIDictionary<String, IType> typeEnvironment) {
        return this.value.getType();
    }
}
