package model.adt;

import exceptions.ExpressionException;
import model.value.IValue;

import java.util.Map;

public interface MyIHeap {
    Integer getFreeValue();

    Map<Integer, IValue> getContent();

    void setContent(Map<Integer, IValue> newMap);

    Integer add(IValue value);

    void update(Integer position, IValue value) throws ExpressionException;

    IValue get(Integer position) throws ExpressionException;
}