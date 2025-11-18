-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3309
-- Generation Time: Nov 18, 2025 at 11:40 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `contacts_db_nodejs`
--

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `email` varchar(30) NOT NULL,
  `phone` text NOT NULL,
  `address` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `first_name`, `last_name`, `email`, `phone`, `address`) VALUES
(1, 'Kushal', 'Kamble', 'kushal.kamble@gmail.com', '9988554411', 'Pune'),
(2, 'Salman', 'Khan', 'salman@gmail.com', '1234567890', 'Mumbai'),
(3, 'shahid', 'kapoor', 'shahid.kapoor@gmail.com', '3334567890', 'Mumbai ');

-- --------------------------------------------------------

--
-- Table structure for table `contacts_new`
--

CREATE TABLE `contacts_new` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contacts_new`
--

INSERT INTO `contacts_new` (`id`, `first_name`, `last_name`, `email`, `phone`, `address`, `created_at`) VALUES
(1, 'John', 'Doe', 'john@example.com', '9876543210', '123 Street, City', '2025-11-18 06:42:13'),
(2, 'Jane', 'Smith', 'jane@example.com', '9123456780', '456 Avenue, City', '2025-11-18 06:42:13'),
(3, 'Hashim', 'Guzman', 'wejeh@mailinator.com', '+1 (239) 962-96', 'Mollit aut dolor exc', '2025-11-18 06:43:30'),
(4, 'Adam', 'Whitley', 'hygemihi@mailinator.com', '+1 (953) 678-72', 'Porro assumenda vel ', '2025-11-18 06:43:39'),
(5, 'Leila', 'Romero', 'zomifehu@mailinator.com', '+1 (985) 558-21', 'Ut officia sit sit s', '2025-11-18 06:43:46'),
(6, 'abhi', 'Kushal', 'abhi@gmail.com', '9988774455', 'Pune', '2025-11-18 06:50:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'Kushal', 'Kamble@123'),
(2, 'Vishal', 'Vtest123'),
(3, 'Salman', 'Khan@123'),
(6, 'chunky', 'secret123'),
(7, 'chunky123', 'secret123'),
(8, 'test', 'secret123'),
(9, 'kushalbbbb', 'secret123'),
(13, 'kushal_updated', 'newpass456'),
(14, 'bhawa', 'bhawasecret123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts_new`
--
ALTER TABLE `contacts_new`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contacts_new`
--
ALTER TABLE `contacts_new`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
