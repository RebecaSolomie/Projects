package model.expressions;

import exceptions.ExpressionException;
import model.adt.MyIDictionary;
import model.adt.MyIHeap;
import model.type.IType;
import model.type.IntType;
import model.value.IValue;
import model.value.IntValue;

public class ArithmeticExpression implements IExpression{
    private final IExpression left;
    private final IExpression right;
    private final ArithmeticOperation operation;

    public ArithmeticExpression(IExpression left, IExpression right, ArithmeticOperation operation){
        this.left = left;
        this.right = right;
        this.operation = operation;
    }

    @Override
    public IValue evaluate(MyIDictionary<String, IValue> symbolTable, MyIHeap heap) throws ExpressionException{
        IValue value1 = left.evaluate(symbolTable, heap);
        IValue value2 = right.evaluate(symbolTable, heap);

        if (!value1.getType().equals(new IntType())) {
            throw new ExpressionException("Arithmetic Error: The first operand is not an integer.");
        }
        if (!value2.getType().equals(new IntType())) {
            throw new ExpressionException("Arithmetic Error: The second operand is not an integer.");
        }

        IntValue int1 = (IntValue) value1;
        IntValue int2 = (IntValue) value2;

        switch (operation){
            case ADD:
                return new IntValue(int1.getValue() + int2.getValue());
            case SUBTRACT:
                return new IntValue(int1.getValue() - int2.getValue());
            case MULTIPLY:
                return new IntValue(int1.getValue() * int2.getValue());
            case DIVIDE:
                if (int2.getValue() == 0){
                    throw new ExpressionException("Arithmetic Error: Division by zero.");
                }
                return new IntValue(int1.getValue() / int2.getValue());
        }
        throw new ExpressionException("Arithmetic Error: Invalid operation.");
    }

    @Override
    public String toString(){
        return left.toString() + " " + operation + " " + right.toString();
    }

    public IExpression deepCopy(){
        return new ArithmeticExpression(left.deepCopy(), right.deepCopy(), operation);
    }

    public IType typeCheck(MyIDictionary<String, IType> typeEnvironment) throws ExpressionException{
        IType type1, type2;
        type1 = left.typeCheck(typeEnvironment);
        type2 = right.typeCheck(typeEnvironment);

        if (type1.equals(new IntType())){
            if (type2.equals(new IntType())){
                return new IntType();
            }
            else{
                throw new ExpressionException("Arithmetic Error: The second operand is not an integer.");
            }
        }
        else{
            throw new ExpressionException("Arithmetic Error: The first operand is not an integer.");
        }
    }
}
