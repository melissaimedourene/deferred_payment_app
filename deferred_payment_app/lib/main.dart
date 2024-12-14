import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'AdminPage.dart';
import 'CartPage.dart';
import 'cart_provider.dart';


void main() {

  runApp(

      MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CartProvider()), // Ajout du Provider ici
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Accueil')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              child: Text('Accéder au Panier'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => CartPage()),
                );
              },
            ),
            ElevatedButton(
              child: Text('Admin - Commandes'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => AdminPage()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

