package model.adt;

import exceptions.ExpressionException;
import model.value.IValue;

import java.util.HashMap;
import java.util.Map;

public class MyHeap implements MyIHeap {
    private final Map<Integer, IValue> map;
    private Integer freeValue;

    public Integer newValue() {
        freeValue += 1;
        if (map.containsKey(freeValue)) {
            freeValue += 1;
        }

        return freeValue;
    }

    public MyHeap(Map<Integer, IValue> map) {
        this.map = map;
        freeValue = 1;
    }

    public MyHeap() {
        map = new HashMap<>();
        freeValue = 1;
    }

    @Override
    public Integer getFreeValue() {
        return freeValue;
    }

    @Override
    public Map<Integer, IValue> getContent() {
        return map;
    }

    @Override
    public void setContent(Map<Integer, IValue> newMap) {
        map.clear();
        for (Integer i : newMap.keySet()) {
            map.put(i, newMap.get(i));
        }
    }

    @Override
    public Integer add(IValue value) {
        map.put(freeValue, value);
        Integer toReturn = freeValue;
        freeValue = newValue();
        return toReturn;
    }

    @Override
    public void update(Integer position, IValue value) throws ExpressionException {
        if (!map.containsKey(position)) {
            throw new ExpressionException(String.format("Heap Error: %d is not in the heap.", position));
        }

        map.put(position, value);
    }

    @Override
    public IValue get(Integer position) throws ExpressionException {
        if (!map.containsKey(position)) {
            throw new ExpressionException(String.format("Heap Error: %s is not in the heap.", position));
        }
        return map.get(position);
    }

    public String toString() {
        StringBuilder result = new StringBuilder("Heap: ");
        for (Integer key: map.keySet()) {
            result.append(key).append(" -> ").append(map.get(key)).append("\n");
        }
        return result.toString();
    }
}