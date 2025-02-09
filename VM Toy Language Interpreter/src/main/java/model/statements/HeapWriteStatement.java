package model.statements;

import exceptions.ExpressionException;
import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.adt.MyIHeap;
import model.expressions.IExpression;
import model.state.PrgState;
import model.type.IType;
import model.type.RefType;
import model.value.IValue;
import model.value.IntValue;
import model.value.RefValue;

public class HeapWriteStatement implements IStatement {
    private final String variableName;
    private final IExpression expression;

    public HeapWriteStatement(String variableName, IExpression expression) {
        this.variableName = variableName;
        this.expression = expression;
    }

    @Override
    public PrgState execute(PrgState state) throws StatementException, ExpressionException {
        MyIDictionary<String, IValue> symbolTable = state.getSymTable();
        MyIHeap heap = state.getHeap();
        if (!symbolTable.contains(variableName)) {
            throw new StatementException(String.format("Heap Write Error: %s is not defined.", variableName));
        }

        IValue variableValue = symbolTable.get(variableName);
        if (!(variableValue instanceof RefValue)) {
            throw new StatementException(String.format("Heap Write Error: %s is not of type Reference.", variableValue));
        }

        RefValue referenceValue = (RefValue) variableValue;
        IValue evaluated = expression.evaluate(symbolTable, heap);
        if (!evaluated.getType().equals(referenceValue.getLocationType())) {
            throw new StatementException(String.format("Heap Write Error: %s is not of type %s.", evaluated, referenceValue.getLocationType()));
        }

        heap.update(referenceValue.getAddress(), evaluated);
        return null;
    }

    @Override
    public IStatement deepCopy() {
        return new HeapWriteStatement(variableName, expression.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("WriteHeap{%s, %s}", variableName, expression);
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        IType variableType = typeEnvironment.get(variableName);
        IType expressionType = expression.typeCheck(typeEnvironment);
        if (!(variableType instanceof RefType)) {
            if (variableType != null) {
                throw new StatementException("Heap Write: variable is not a reference!");
            }
            if (!expressionType.equals(((RefValue) variableType).getLocationType())) {
                throw new StatementException("Heap Write: right hand side and left hand side have different types!");
            }
        }
        return typeEnvironment;

    }
}