---
layout: post
title: "Bayesian Parameter Estimation for 2R Manipulators"
author: Giacomo Vianello
authors: F Baldini, F Berti, S Ferracane, S Michielon, <strong>G Vianello</strong>
categories: Research
image: /images/mcmc_robot.png
code: https://github.com/GiacomoVianello-1/MCMC_2R_manipulator
paper: /pdfs/Estimation_paper.pdf
venue: Estimation and Filtering - University of Padua
abstract: "Application of Markov Chain Monte Carlo (MCMC) methods to estimate the dynamic parameters of a 2-DOF planar manipulator. The project uses a Bayesian approach to infer link masses and lengths from noisy joint torque and trajectory data, comparing different sampling strategies and prior distributions."
---
This project implements a Bayesian framework using Markov Chain Monte Carlo (MCMC) to estimate the friction parameters of a 2-degree-of-freedom (2R) planar robotic manipulator. By employing the Metropolis-Hastings algorithm, the system identifies both linear and nonlinear friction components from noisy torque and velocity data.