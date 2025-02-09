package model.expressions;

import exceptions.ExpressionException;
import model.adt.MyIDictionary;
import model.adt.MyIHeap;
import model.type.IType;
import model.value.BoolValue;
import model.value.IValue;

public class NotExpression implements IExpression{
    IExpression exp;

    public NotExpression(IExpression exp){
        this.exp = exp;
    }

    @Override
    public IValue evaluate(MyIDictionary<String, IValue> table, MyIHeap heap) throws ExpressionException {
        BoolValue value = (BoolValue) exp.evaluate(table, heap);
        if (value.getValue())
            return new BoolValue(false);
        else
            return new BoolValue(true);
    }

    @Override
    public IType typeCheck(MyIDictionary<String, IType> typeEnv) throws ExpressionException {
        return exp.typeCheck(typeEnv);
    }

    @Override
    public IExpression deepCopy() {
        return new NotExpression(exp.deepCopy());
    }

    @Override
    public String toString() {
        return "!(" + exp + ")";
    }
}
