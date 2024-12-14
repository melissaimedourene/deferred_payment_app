import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'cart_provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:url_launcher/url_launcher.dart'; // Import du package

class CartPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context);
    final cartItems = cartProvider.cartItems;

    return Scaffold(
      appBar: AppBar(
        title: Text('Panier'),
        backgroundColor: Colors.red,
      ),
      body: cartItems.isEmpty
          ? Center(
        child: Text(
          'Votre panier est vide.',
          style: TextStyle(fontSize: 18),
        ),
      )
          : Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: cartItems.length,
              itemBuilder: (context, index) {
                final item = cartItems[index];
                return ListTile(
                  title: Text(item['name']),
                  subtitle: Text('Quantité: ${item['quantity']}'),
                  trailing: Text(
                    '${(item['price'] * item['quantity']).toStringAsFixed(2)} €',
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Text(
                  'Total: ${cartProvider.totalPrice.toStringAsFixed(2)} €',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () async {
                    try {
                      // Appel au backend pour obtenir l'URL Stripe Checkout
                      final checkoutUrl = await createCheckoutSession(
                        (cartProvider.totalPrice * 100).toInt(),
                      );

                      // Redirige vers Stripe Checkout
                      if (await canLaunchUrl(Uri.parse(checkoutUrl))) {
                        await launchUrl(Uri.parse(checkoutUrl));
                      } else {
                        throw 'Impossible d\'ouvrir l\'URL : $checkoutUrl';
                      }
                    } catch (e) {
                      print('Erreur : $e');
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Erreur : $e')),
                      );
                    }
                  },
                  child: Text('Payer'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<String> createCheckoutSession(int amount) async {
    final response = await http.post(
      Uri.parse('http://localhost:4242/create-checkout-session'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'amount': amount, 'currency': 'eur'}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['url']; // Retourne l'URL Stripe Checkout
    } else {
      throw Exception('Erreur lors de la création de la session Stripe Checkout');
    }
  }


}
