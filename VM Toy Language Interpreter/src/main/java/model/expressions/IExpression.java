package model.expressions;

import exceptions.ExpressionException;
import model.adt.MyIDictionary;
import model.adt.MyIHeap;
import model.type.IType;
import model.value.IValue;
import model.state.PrgState;

public interface IExpression {
    IValue evaluate(MyIDictionary<String, IValue> symbolTable, MyIHeap heap) throws ExpressionException;
    IExpression deepCopy();
    IType typeCheck(MyIDictionary<String, IType> typeEnvironment) throws ExpressionException;
}
