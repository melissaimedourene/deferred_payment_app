import 'package:flutter/material.dart';

class CartProvider with ChangeNotifier {
  // Ajoutez des articles de test ici
  final List<Map<String, dynamic>> _cartItems = [
    {'name': 'Produit 1', 'quantity': 2, 'price': 15.99},
    {'name': 'Produit 2', 'quantity': 1, 'price': 9.99},
    {'name': 'Produit 3', 'quantity': 3, 'price': 5.00},
  ];

  List<Map<String, dynamic>> get cartItems => _cartItems;

  double get totalPrice => _cartItems.fold(
    0,
        (sum, item) => sum + (item['price'] * item['quantity']),
  );

  void addItem(Map<String, dynamic> item) {
    _cartItems.add(item);
    notifyListeners();
  }

  void clearCart() {
    _cartItems.clear();
    notifyListeners();
  }
}

