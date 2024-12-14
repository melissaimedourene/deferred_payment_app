import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AdminPage extends StatefulWidget {
  @override
  _AdminPageState createState() => _AdminPageState();
}

class _AdminPageState extends State<AdminPage> {
  List<Map<String, dynamic>> orders = []; // Typage explicite pour éviter des erreurs
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    fetchOrders();
  }

  Future<void> fetchOrders() async {
    setState(() {
      isLoading = true;
    });

    try {
      final response = await http.get(Uri.parse('http://localhost:4242/pending-orders'));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          orders = data.map((order) {
            return {
              'id': order['id'] ?? '',
              'amount': order['amount'] ?? 0,
              'status': order['status'] ?? 'unknown',
            };
          }).toList();
          print('Données brutes reçues : ${response.body}');

        });
      } else {
        _showSnackBar('Erreur lors du chargement des commandes : ${response.body}');
      }
    } catch (e) {
      _showSnackBar('Erreur réseau : $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Future<void> capturePayment(String paymentIntentId) async {
  //   try {
  //     final response = await http.post(
  //       Uri.parse('http://localhost:4242/capture-payment'),
  //       headers: {'Content-Type': 'application/json'},
  //       body: jsonEncode({'paymentIntentId': paymentIntentId}),
  //     );
  //
  //     if (response.statusCode == 200) {
  //       _showSnackBar('Paiement capturé avec succès');
  //       fetchOrders();
  //     } else {
  //       _showSnackBar('Erreur lors de la capture : ${response.body}');
  //     }
  //   } catch (e) {
  //     _showSnackBar('Erreur réseau : $e');
  //   }
  // }
  Future<void> capturePayment(String paymentIntentId) async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:4242/capture-payment'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'paymentIntentId': paymentIntentId}),
      );

      if (response.statusCode == 200) {
        _showSnackBar('Paiement capturé avec succès');
        fetchOrders();
      } else {
        final responseBody = jsonDecode(response.body);
        _showSnackBar('Erreur lors de la capture : ${responseBody['error']}');
      }
    } catch (e) {
      _showSnackBar('Erreur réseau : $e');
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Admin - Commandes'),
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : orders.isEmpty
          ? Center(child: Text('Aucune commande en attente'))
          : ListView.builder(
        itemCount: orders.length,
        itemBuilder: (context, index) {
          final order = orders[index];
          print('ID de commande envoyé : ${order['id']}');

          return ListTile(
            title: Text('Commande : ${order['id']}'),
            subtitle: Text(
              'Montant : ${(order['amount'] / 100).toStringAsFixed(2)} €',
            ),
            trailing: order['status'] == 'pending'
                ? IconButton(
              icon: Icon(Icons.check, color: Colors.green),
              onPressed: () {
                if (order['id'] != '') {
                  capturePayment(order['id']);
                } else {
                  _showSnackBar('ID de commande manquant.');
                }
              },
            )
                : Text(
              order['status'] == 'captured' ? 'Capturé' : 'Statut inconnu',
              style: TextStyle(color: Colors.blue),
            ),


          );
        },
      ),
    );
  }
}



