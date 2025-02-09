package model.expressions;

import model.adt.MyDictionary;
import model.adt.MyIDictionary;
import model.adt.MyIHeap;
import model.type.BoolType;
import model.type.IType;
import model.type.IntType;
import model.value.IValue;
import model.value.IntValue;
import model.value.BoolValue;
import exceptions.ExpressionException;

public class RelationalExpression implements IExpression {
    private final IExpression expression1;

    private final IExpression expression2;

    String operator;

    public RelationalExpression(IExpression expression1, IExpression expression2, String operator) {
        this.expression1 = expression1;
        this.expression2 = expression2;
        this.operator = operator;
    }

    @Override
    public IValue evaluate(MyIDictionary<String, IValue> symbolTable, MyIHeap heap) throws ExpressionException {
        IValue value1 = expression1.evaluate(symbolTable, heap);
        IValue value2 = expression2.evaluate(symbolTable, heap);

        if(!value1.getType().equals(new IntType())) {
            throw new ExpressionException("Relational Error: The first operand is not an integer.");
        }
        if(!value2.getType().equals(new IntType())) {
            throw new ExpressionException("Relational Error: The second operand is not an integer.");
        }

        int intValue1 = ((IntValue)value1).getValue();
        int intValue2 = ((IntValue)value2).getValue();

        switch (operator) {
            case ">":
                return new BoolValue(intValue1 > intValue2);
            case "<":
                return new BoolValue(intValue1 < intValue2);
            case ">=":
                return new BoolValue(intValue1 >= intValue2);
            case "<=":
                return new BoolValue(intValue1 <= intValue2);
            case "==":
                return new BoolValue(intValue1 == intValue2);
            case "!=":
                return new BoolValue(intValue1 != intValue2);
            default:
                throw new ArithmeticException("Invalid operand!");
        }
    }

    public String toString() {
        return expression1.toString() + " " + operator + "  " + expression2.toString();
    }

    @Override
    public IExpression deepCopy() {
        return new RelationalExpression(expression1.deepCopy(), expression2.deepCopy(), operator);
    }

    public IType typeCheck(MyIDictionary<String, IType> typeEnvironment) throws ExpressionException {
        IType type1 = expression1.typeCheck(typeEnvironment);
        IType type2 = expression2.typeCheck(typeEnvironment);
        if (!type1.equals(new IntType())) {
            throw new ExpressionException("Relational Error: The first operand is not an integer.");
        }
        if (!type2.equals(new IntType())) {
            throw new ExpressionException("Relational Error: The second operand is not an integer.");
        }
        return new BoolType();
    }
}