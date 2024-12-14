//
//require('dotenv').config();
//const express = require('express');
//const stripe = require('stripe')('sk_test_51PdBuCC4pc82x5F0274r7XXRxOb5pftxlyCtfbAb5LnZGK9HQ9Ux4lT56yEwKMisOGspC81rx6nBxA2rpTbRaQHC002UzahPts');
//const bodyParser = require('body-parser');
//const cors = require('cors');
//
//let pendingOrders = []; // Stocker les commandes en attente
//
//const app = express();
//app.use(cors());
//app.use(bodyParser.json());
//
//// Création d'une session Stripe Checkout
//
//app.post('/create-checkout-session', async (req, res) => {
//  const { amount, currency } = req.body;
//
//  try {
//    // Validation des données d'entrée
//    if (!amount || amount <= 0) {
//      return res.status(400).json({ error: 'Montant invalide ou manquant.' });
//    }
//
//    if (!currency) {
//      return res.status(400).json({ error: 'Devise invalide ou manquante.' });
//    }
//
//    // Créez une session Stripe Checkout avec un PaymentIntent intégré
//    const session = await stripe.checkout.sessions.create({
//      payment_method_types: ['card'],
//      mode: 'payment',
//      payment_intent_data: {
//        capture_method: 'manual', // Capture différée
//      },
//      line_items: [
//        {
//          price_data: {
//            currency: currency || 'eur',
//            product_data: { name: 'Commande en attente' },
//            unit_amount: amount, // Montant en centimes
//          },
//          quantity: 1,
//        },
//      ],
//      success_url: 'http://localhost:4242/success',
//      cancel_url: 'http://localhost:4242/cancel',
//    });
//
//    console.log('Session Checkout créée :', session);
//
//    res.json({
//      message: 'Session Checkout créée avec succès.',
//      url: session.url,
//    });
//  } catch (error) {
//    console.error('Erreur lors de la création de la session :', error.message);
//    res.status(400).json({ error: error.message });
//  }
//});
//
//// Capture d'un paiement
//app.post('/capture-payment', async (req, res) => {
//  const { paymentIntentId } = req.body;
//
//  try {
//    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
//    console.log('Paiement capturé :', paymentIntent);
//
//    // Mettre à jour le statut dans les commandes en attente
//    pendingOrders = pendingOrders.map(order =>
//      order.id === paymentIntentId ? { ...order, status: 'captured' } : order
//    );
//
//    res.json({ message: 'Paiement capturé avec succès.' });
//  } catch (error) {
//    console.error('Erreur lors de la capture du paiement :', error.message);
//    res.status(400).json({ error: error.message });
//  }
//});
//
//// Récupérer les commandes en attente
//app.get('/pending-orders', (req, res) => {
//  res.json(pendingOrders);
//});
//
//const PORT = process.env.PORT || 4242;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//
//require('dotenv').config();
//const express = require('express');
//const stripe = require('stripe')('sk_test_51PvGpn06qXpoCXXSYbrCYt1QME0hbOFCcr2iJBmZc8ngUscai79UcE8EvzAKWPdvEJvVmJ1GD61ei1NvdhjVjxwQ00JZwih0Rt');
//const bodyParser = require('body-parser');
//const cors = require('cors');
//
//let pendingOrders = []; // Stocker les commandes en attente
//
//const app = express();
//app.use(cors());
//app.use(bodyParser.json());
//
//
//app.post('/create-checkout-session', async (req, res) => {
//  const { amount, currency } = req.body;
//
//  try {
//    if (!amount || amount <= 0 || !currency) {
//      return res.status(400).json({ error: 'Données de paiement invalides.' });
//    }
//
//
//const session = await stripe.checkout.sessions.create({
//  payment_method_types: ['card'],
//  mode: 'payment',
//  payment_intent_data: {
//    capture_method: 'manual',
//  },
//  line_items: [
//    {
//      price_data: {
//        currency: currency || 'eur',
//        product_data: { name: 'Commande en attente' },
//        unit_amount: amount,
//      },
//      quantity: 1,
//    },
//  ],
//  success_url: 'http://localhost:4242/success',
//  cancel_url: 'http://localhost:4242/cancel',
//});
//
//
////const paymentIntentId = session.payment_intent || session.id; // Utilisez session.id comme fallback
//const paymentIntentId = session.payment_intent;
//
//if (!paymentIntentId) {
//  console.error('Erreur : Aucun payment_intent trouvé dans la session Stripe.');
//  return res.status(400).json({ error: 'Erreur de session Stripe : payment_intent introuvable.' });
//}
//
//
//pendingOrders.push({
//  id: paymentIntentId, // Utilisez uniquement payment_intent
//  amount,
//  currency,
//  status: 'pending',
//});
//
//
//    res.json({ url: session.url });
//  } catch (error) {
//    console.error('Erreur création session :', error.message);
//    res.status(400).json({ error: error.message });
//  }
//});
//
//// Capture d'un paiement
////app.post('/capture-payment', async (req, res) => {
////  const { paymentIntentId } = req.body;
////
////  try {
////    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
////
////    // Mise à jour du statut de la commande capturée
////    pendingOrders = pendingOrders.map(order =>
////      order.id === paymentIntentId ? { ...order, status: 'captured' } : order
////    );
////
////    res.json({ message: 'Paiement capturé avec succès.' });
////  } catch (error) {
////    console.error('Erreur capture paiement :', error.message);
////    res.status(400).json({ error: error.message });
////  }
////});
//app.post('/capture-payment', async (req, res) => {
//  const { paymentIntentId } = req.body;
//
//  if (!paymentIntentId) {
//    return res.status(400).json({ error: 'ID du payment_intent manquant.' });
//  }
//
//  try {
//    const order = pendingOrders.find(order => order.id === paymentIntentId);
//    if (!order) {
//      return res.status(404).json({ error: 'Commande introuvable.' });
//    }
//
//    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
//
//    // Mise à jour du statut de la commande capturée
//    pendingOrders = pendingOrders.map(order =>
//      order.id === paymentIntentId ? { ...order, status: 'captured' } : order
//    );
//
//    res.json({ message: 'Paiement capturé avec succès.', paymentIntent });
//  } catch (error) {
//    console.error('Erreur capture paiement :', error.message);
//    res.status(400).json({ error: error.message });
//  }
//});
//
//// Récupérer les commandes en attente
//app.get('/pending-orders', (req, res) => {
//  console.log('Pending Orders:', pendingOrders);
//  res.json(pendingOrders);
//});
//
//const PORT = process.env.PORT || 4242;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//
require('dotenv').config();
const express = require('express');
const stripe = require('stripe')('sk_test_51PvGpn06qXpoCXXSYbrCYt1QME0hbOFCcr2iJBmZc8ngUscai79UcE8EvzAKWPdvEJvVmJ1GD61ei1NvdhjVjxwQ00JZwih0Rt');
const bodyParser = require('body-parser');
const cors = require('cors');

let pendingOrders = []; // Stocker les commandes en attente

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route pour créer une session de paiement avec un payment_intent
app.post('/create-checkout-session', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    if (!amount || amount <= 0 || !currency) {
      return res.status(400).json({ error: 'Données de paiement invalides.' });
    }

    // Étape 1 : Créer un Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      capture_method: 'manual', // Capture manuelle
    });

    console.log('Payment Intent créé :', paymentIntent);

    // Étape 2 : Créer une Session Stripe en utilisant payment_intent_data
   const session = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     mode: 'payment',
     payment_intent_data: {
       capture_method: 'manual', // Assurez-vous que le mode de capture est manuel ici
     },
     line_items: [
       {
         price_data: {
           currency,
           product_data: { name: 'Commande en attente' },
           unit_amount: amount,
         },
         quantity: 1,
       },
     ],
     success_url: 'http://localhost:4242/success?session_id={CHECKOUT_SESSION_ID}',
     cancel_url: 'http://localhost:4242/cancel',
   });


//    const session = await stripe.checkout.sessions.create({
//      payment_method_types: ['card'],
//      mode: 'payment',
//      payment_intent_data: {
//        setup_future_usage: 'on_session', // Si vous voulez réutiliser les méthodes de paiement
//      },
//      line_items: [
//        {
//          price_data: {
//            currency,
//            product_data: { name: 'Commande en attente' },
//            unit_amount: amount,
//          },
//          quantity: 1,
//        },
//      ],
//      success_url: 'http://localhost:4242/success',
//      cancel_url: 'http://localhost:4242/cancel',
//    });

    console.log('Session Stripe créée :', session);

    // Ajouter la commande en attente
    pendingOrders.push({
      id: paymentIntent.id,
      amount,
      currency,
      status: 'pending',
    });

    // Retourner l'URL de la session Stripe
    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur création session :', error.message);
    res.status(400).json({ error: error.message });
  }
});



// Route pour capturer un paiement
app.post('/capture-payment', async (req, res) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({ error: 'ID du payment_intent manquant.' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('Statut actuel du PaymentIntent :', paymentIntent.status);

    if (paymentIntent.status !== 'requires_capture') {
      return res.status(400).json({
        error: `Impossible de capturer : statut actuel ${paymentIntent.status}.`,
      });
    }
    console.log('Statut actuel du PaymentIntent :', paymentIntent.status);

    const capturedPayment = await stripe.paymentIntents.capture(paymentIntentId);

    // Mise à jour des commandes en attente
    pendingOrders = pendingOrders.map(order =>
      order.id === paymentIntentId ? { ...order, status: 'captured' } : order
    );

    res.json({ message: 'Paiement capturé avec succès.', paymentIntent: capturedPayment });
  } catch (error) {
    console.error('Erreur capture paiement :', error.message);
    res.status(400).json({ error: error.message });
  }
});


// Route pour récupérer les commandes en attente
app.get('/pending-orders', (req, res) => {
  console.log('Pending Orders:', pendingOrders);
  res.json(pendingOrders);
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
