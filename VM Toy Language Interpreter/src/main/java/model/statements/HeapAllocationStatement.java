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
import model.value.RefValue;

public class HeapAllocationStatement implements IStatement {
    private final String variableName;
    private final IExpression expression;

    public HeapAllocationStatement(String variableName, IExpression expression) {
        this.variableName = variableName;
        this.expression = expression;
    }

    @Override
    public PrgState execute(PrgState state) throws StatementException, ExpressionException {
        MyIDictionary<String, IValue> symbolTable = state.getSymTable();
        MyIHeap heap = state.getHeap();

        if (!symbolTable.contains(variableName)) {
            throw new StatementException(String.format("Heap Allocation Error: %s is not defined.", variableName));
        }

        IValue variableValue = symbolTable.get(variableName);
        if (!(variableValue.getType() instanceof RefType)) {
            throw new StatementException(String.format("Heap Allocation Error: %s is not of type Reference.", variableName));
        }

        IValue evaluated = expression.evaluate(symbolTable, heap);
        IType locationType = ((RefValue)variableValue).getLocationType();
        if (!locationType.equals(evaluated.getType())) {
            throw new StatementException(String.format("Heap Allocation Error: %s is not of type %s.", variableName, evaluated.getType()));
        }

        Integer newPosition = heap.add(evaluated);
        symbolTable.insert(variableName, new RefValue(newPosition, locationType));

        return null;
    }

    @Override
    public IStatement deepCopy() {
        return new HeapAllocationStatement(variableName, expression.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("New(%s, %s)", variableName, expression);
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        IType variableType = typeEnvironment.get(variableName);
        IType expressionType = expression.typeCheck(typeEnvironment);
        if (!variableType.equals(new RefType(expressionType))) {
            throw new StatementException("Heap Allocation: right hand side and left hand side have different types!");
        }
        return typeEnvironment;
    }
}
