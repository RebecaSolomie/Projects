package model.expressions;

import exceptions.ExpressionException;
import model.adt.MyDictionary;
import model.adt.MyIDictionary;
import model.adt.MyIHeap;
import model.expressions.LogicalOperation;
import model.type.BoolType;
import model.type.IType;
import model.value.BoolValue;
import model.value.IValue;

public class LogicalExpression implements IExpression{
    private final IExpression left;
    private final IExpression right;
    private final LogicalOperation operation;

    public LogicalExpression(IExpression left, IExpression right, LogicalOperation operation) {
        this.left = left;
        this.right = right;
        this.operation = operation;
    }

    @Override
    public IValue evaluate(MyIDictionary<String, IValue> symTable, MyIHeap heap) throws ExpressionException {
        IValue leftValue = left.evaluate(symTable, heap);
        IValue rightValue = right.evaluate(symTable, heap);
        if (!(leftValue.getType().equals(new BoolType()))) {
            throw new ExpressionException("Left operand is not a boolean!");
        }
        Boolean leftV = (((BoolValue)leftValue).getValue());
        Boolean rightV = (((BoolValue)rightValue).getValue());
        if (operation == LogicalOperation.AND) {
            return new BoolValue(leftV && rightV);
        }
        else {
            return new BoolValue(leftV || rightV);
        }
    }

    @Override
    public String toString() {
        return left.toString() + " " + operation.toString().toLowerCase() + " " + right.toString();
    }

    public IExpression deepCopy() {
        return new LogicalExpression(left.deepCopy(), right.deepCopy(), operation);
    }

    public IType typeCheck(MyIDictionary<String, IType> typeEnvironment) throws ExpressionException {
        IType type1 = left.typeCheck(typeEnvironment);
        IType type2 = right.typeCheck(typeEnvironment);
        if (!type1.equals(new BoolType())) {
            throw new ExpressionException("Logical Expression Error: The first operand is not a boolean.");
        }
        if (!type2.equals(new BoolType())) {
            throw new ExpressionException("Logical Expression Error: The second operand is not a boolean.");
        }
        return new BoolType();
    }
}
