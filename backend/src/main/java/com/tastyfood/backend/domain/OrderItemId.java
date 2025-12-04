package com.tastyfood.backend.domain;

import java.io.Serializable;
import java.util.Objects;

public class OrderItemId implements Serializable {
    private String orderId;
    private Integer itemId;
    
    public OrderItemId() {}
    
    public OrderItemId(String orderId, Integer itemId) {
        this.orderId = orderId;
        this.itemId = itemId;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderItemId that = (OrderItemId) o;
        return Objects.equals(orderId, that.orderId) &&
               Objects.equals(itemId, that.itemId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(orderId, itemId);
    }
    
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    
    public Integer getItemId() { return itemId; }
    public void setItemId(Integer itemId) { this.itemId = itemId; }
}
