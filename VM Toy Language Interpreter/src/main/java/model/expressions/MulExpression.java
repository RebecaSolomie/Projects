package model.expressions;

import exceptions.ExpressionException;
import model.adt.MyIDictionary;
import model.adt.MyIHeap;
import model.type.IType;
import model.type.IntType;
import model.value.IValue;

public class MulExpression implements IExpression{
    IExpression exp1, exp2;

    public MulExpression(IExpression exp1, IExpression exp2){
        this.exp1 = exp1;
        this.exp2 = exp2;
    }

    @Override
    public IValue evaluate(MyIDictionary<String, IValue> table, MyIHeap heap) throws ExpressionException {
        IExpression newExp = new ArithmeticExpression(
                new ArithmeticExpression( exp1, exp2, ArithmeticOperation.MULTIPLY),
                new ArithmeticExpression( exp1, exp2, ArithmeticOperation.ADD), ArithmeticOperation.SUBTRACT);
        return newExp.evaluate(table, heap);
    }

    @Override
    public IType typeCheck(MyIDictionary<String, IType> typeEnv) throws ExpressionException {
        IType type1 = exp1.typeCheck(typeEnv);
        IType type2 = exp2.typeCheck(typeEnv);
        if (type1.equals(new IntType()) && type2.equals(new IntType()))
            return new IntType();
        else
            throw new ExpressionException("MulExp: Both expressions must be of int type!");
    }

    @Override
    public IExpression deepCopy() {
        return new MulExpression(exp1.deepCopy(), exp2.deepCopy());
    }

    @Override
    public String toString() {
        return "MUL(" + exp1 + "," + exp2 + ")";
    }
}
