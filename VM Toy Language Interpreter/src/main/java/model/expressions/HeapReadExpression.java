package model.expressions;

import exceptions.ExpressionException;
import model.adt.MyIDictionary;
import model.adt.MyIHeap;
import model.type.IType;
import model.type.RefType;
import model.value.IValue;
import model.value.RefValue;

public class HeapReadExpression implements IExpression {
    private final IExpression expression;

    public HeapReadExpression(IExpression expression) {
        this.expression = expression;
    }

    @Override
    public IValue evaluate(MyIDictionary<String, IValue> symTable, MyIHeap heap) throws ExpressionException, ExpressionException {
        IValue evaluated = expression.evaluate(symTable, heap);
        if (!(evaluated instanceof RefValue)) {
            throw new ExpressionException(String.format("Heap Read Error: %s not of type Reference.", evaluated));
        }

        RefValue referenceValue = (RefValue) evaluated;
        return heap.get(referenceValue.getAddress());
    }

    @Override
    public IExpression deepCopy() {
        return new HeapReadExpression(expression.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("HeapRead(%s)", expression);
    }

    public IType typeCheck(MyIDictionary<String, IType> typeEnvironment) throws ExpressionException {
        IType type = expression.typeCheck(typeEnvironment);
        if (!(type instanceof RefType)) {
            throw new ExpressionException("Heap Read Error: Expression is not of type Reference.");
        }
        return ((RefType) type).getInner();
    }
}