-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 21 mai 2026 à 21:57
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `black_energie`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`, `created_at`) VALUES
(1, 'hamza.emilie23@gmail.com', '$2a$10$9GfS1qK1q7oK3cZV6d7.J.X8oR1d7oK3cZV6d7.J.X8oR1d7oK3cZ', '2026-05-09 04:04:53');

-- --------------------------------------------------------

--
-- Structure de la table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `delivery_costs`
--

CREATE TABLE `delivery_costs` (
  `id` int(11) NOT NULL,
  `city` varchar(255) NOT NULL,
  `cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('single','group','all') NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `target_ids` text DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offers`
--

INSERT INTO `offers` (`id`, `name`, `type`, `discount_type`, `discount_value`, `target_ids`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES
(1, 'test', 'single', 'percentage', 10.00, '[3]', '2026-05-15 00:00:00', '2026-05-17 00:00:00', 1, '2026-05-16 17:35:08');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `product_name` text NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_whatsapp` varchar(50) NOT NULL,
  `customer_address` text NOT NULL,
  `weight` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `product_name`, `customer_name`, `customer_whatsapp`, `customer_address`, `weight`, `quantity`, `total_price`, `status`, `created_at`) VALUES
(1, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Saif belfaquir', '0649157151', 'rue 430 nur 29 cite des fonctioner agadir\nAgadir', '250g', 1, 35.00, 'pending', '2026-05-16 17:36:42'),
(2, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Saif belfaquir', '0649157151', 'rue 430 nur 29 cite des fonctioner agadir\nAgadir', '250g', 1, 35.00, 'pending', '2026-05-16 17:38:58'),
(3, 'Heavy Body | Premium Coffee Blend by Black Energie', 'DROP DATABASE `black_energie`;', '0649157151', 'rue 430 nur 29 cite des fonctioner agadir\nAgadir', '250g', 1, 35.00, 'pending', '2026-05-17 01:12:01'),
(4, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Saif belfaquir', '0649157151', 'rue 430 nur 29 cite des fonctioner agadir\nAgadir', '250g', 1, 32.00, 'pending', '2026-05-17 02:03:18');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `price` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `product_type` enum('single','pack') DEFAULT 'single',
  `intensity` int(11) DEFAULT 5,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `price`, `description`, `product_type`, `intensity`, `image_url`, `created_at`) VALUES
(3, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'colombia-supremo', '18.00', 'Discover the gold standard of South American coffee with Colombia Supremo. Sourced from the high-altitude Andean peaks, this single-origin selection represents the largest and highest quality beans Colombia has to offer. It is a refined, classic cup designed for those who appreciate balance, clarity, and a hint of natural sweetness.', 'single', 3, 'http://localhost:5000/uploads/1778529753329-993749041.png', '2026-05-15 06:48:51'),
(4, 'Heavy Body | Premium Coffee Blend by Black Energie', 'heavy-body', '20.00', 'Experience the pinnacle of bold, morning fuel with Heavy Body. Designed for those who demand a powerful kick and a velvety texture, this blend is a masterclass in depth and intensity.', 'single', 5, 'http://localhost:5000/uploads/1778529781608-132198330.png', '2026-05-15 06:48:51'),
(5, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'brazil-velvet', '17.00', 'Indulge in the creamy, comforting essence of South America with Brazil Velvet. Sourced from the sun-drenched Cerrado plains, this single-origin selection is defined by its exceptionally low acidity and luxurious texture. It is a smooth, dependable cup that feels as soft on the palate as its name suggests.', 'single', 2, 'http://localhost:5000/uploads/1778529873285-856367590.png', '2026-05-15 06:48:51'),
(6, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'smooth-classic', '19.00', 'Discover the perfect everyday essential with Smooth Classic. This blend is the bridge between intensity and refinement, crafted for those who appreciate the timeless tradition of a well-balanced cup. It’s the reliable companion for your morning ritual or your afternoon reset.', 'single', 4, 'http://localhost:5000/uploads/1778529903998-380561424.png', '2026-05-15 06:48:51'),
(7, 'Strong Espresso | High-Performance Energy by Black Energie', 'strong-espresso', '22.00', 'Elevate your expectations with Strong Espresso. Engineered for the bold and the driven, this blend is designed to provide a sharp, clean focus. Whether you’re fueling up for a long night of coding or a high-intensity workout, this is the definitive choice for those who need their coffee to work as hard as they do.', 'single', 5, 'http://localhost:5000/uploads/1778529967096-444751596.png', '2026-05-15 06:48:51'),
(8, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'aroma-light', '21.00', 'Experience coffee at its most fragrant with Aroma Light. This blend is a tribute to the delicate and complex side of the bean, focusing on brightness and perfume rather than bitterness. It is the perfect choice for the connoisseur who seeks a sophisticated, tea-like clarity in their cup.', 'single', 1, 'http://localhost:5000/uploads/1778530069995-276816408.png', '2026-05-15 06:48:51');

-- --------------------------------------------------------

--
-- Structure de la table `product_weights`
--

CREATE TABLE `product_weights` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `weight_value` varchar(50) NOT NULL,
  `weight_unit` varchar(20) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `product_weights`
--

INSERT INTO `product_weights` (`id`, `product_id`, `weight_value`, `weight_unit`, `price`) VALUES
(19, 3, '250', 'g', 18.00),
(20, 3, '500', 'g', 34.00),
(21, 3, '1', 'kg', 65.00),
(22, 4, '250', 'g', 20.00),
(23, 4, '500', 'g', 38.00),
(24, 4, '1', 'kg', 72.00),
(25, 5, '250', 'g', 17.00),
(26, 5, '500', 'g', 32.00),
(27, 5, '1', 'kg', 60.00),
(28, 6, '250', 'g', 19.00),
(29, 6, '500', 'g', 36.00),
(30, 6, '1', 'kg', 68.00),
(31, 7, '250', 'g', 22.00),
(32, 7, '500', 'g', 42.00),
(33, 7, '1', 'kg', 80.00),
(34, 8, '250', 'g', 21.00),
(35, 8, '500', 'g', 40.00),
(36, 8, '1', 'kg', 75.00);

-- --------------------------------------------------------

--
-- Structure de la table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `product_slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Index pour la table `delivery_costs`
--
ALTER TABLE `delivery_costs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `city` (`city`);

--
-- Index pour la table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Index pour la table `product_weights`
--
ALTER TABLE `product_weights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `delivery_costs`
--
ALTER TABLE `delivery_costs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `product_weights`
--
ALTER TABLE `product_weights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `product_weights`
--
ALTER TABLE `product_weights`
  ADD CONSTRAINT `product_weights_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
