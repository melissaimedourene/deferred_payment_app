import 'dart:convert';

import 'package:url_launcher/url_launcher.dart';
import'package:http/http.dart'  as http;


Future<void> redirectToCheckout(int amount) async {
  final response = await http.post(
    Uri.parse('http://localhost:4242/create-checkout-session'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'amount': amount, 'currency': 'eur'}),
  );

  if (response.statusCode == 200) {
    final url = jsonDecode(response.body)['url'];
    // Rediriger vers Stripe Checkout
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    } else {
      throw 'Impossible d\'ouvrir l\'URL : $url';
    }
  } else {
    print('Erreur : ${response.body}');
  }
}

