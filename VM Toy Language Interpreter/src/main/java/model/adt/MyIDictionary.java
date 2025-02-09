package model.adt;

import exceptions.ExpressionException;
import exceptions.KeyNotFoundException;
import model.value.StringValue;

import java.util.Set;
import java.util.Map;

public interface MyIDictionary<K, V> {
    void insert(K key, V value);
    void remove(K key) throws ExpressionException;
    boolean contains(K key);
    public V get(K key) throws ExpressionException;
    public Set<K> getKeys();
    boolean containsKey(StringValue value);

    Map<K, V> getDictionary();

    void update(K key, V value);

    MyIDictionary<K, V> copy();
}
