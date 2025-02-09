package model.adt;

import exceptions.ExpressionException;
import model.value.StringValue;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class MyDictionary <K, V> implements MyIDictionary<K, V> {
    Map<K, V> map;

    public MyDictionary() {
        map = new HashMap<K, V>();
    }

    @Override
    public void insert(K key, V value) {
        this.map.put(key, value);
    }

    @Override
    public void remove(K key) throws ExpressionException {
        if(this.map.containsKey(key))
            this.map.remove(key);
        else
            throw new ExpressionException("Key not found");
    }

    @Override
    public boolean contains(K key) {
        return this.map.containsKey(key);
    }

    @Override
    public V get(K key) throws ExpressionException {
        if(this.map.containsKey(key))
            return this.map.get(key);
        else
            throw new ExpressionException("Key not found");
    }

    public String toString() {
        StringBuilder st = new StringBuilder();
        this.map.forEach((k,v)->{
            st.append(k).append(" -> ").append(v).append("\n");
        });
        return "Dictionary contains: " + st.toString();

    }

    public Set<K> getKeys() {
        return this.map.keySet();
    }

    public boolean containsKey(StringValue value) {
        for (K key : this.map.keySet()) {
            if (key instanceof StringValue && ((StringValue) key).equals(value)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public Map<K, V> getDictionary() {
        return this.map;
    }

    @Override
    public void update(K key, V value) {
        map.put(key, value);
    }

    @Override
    public MyIDictionary<K, V> copy() {
        MyIDictionary<K, V> newDictionary = new MyDictionary<>();
        for (K key : this.map.keySet()) {
            newDictionary.insert(key, this.map.get(key));
        }
        return newDictionary;
    }
}
