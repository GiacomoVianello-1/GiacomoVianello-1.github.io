---
layout: post
title: "NMPC for Inverted Pendulum on a Cart using Acados"
author: "Giacomo Vianello"
authors: 
categories: Research
image: /images/pendulum.gif
code: https://github.com/GiacomoVianello-1/NMPC-Inverted-Pendulum-Acados
poster: /pdfs/NMPC_Inverted_Pendulum.pdf
venue: Course Project - Adaptive and Model Predictive Control
abstract: "Implementation of a Non-linear Model Predictive Control (NMPC) strategy to stabilize an inverted pendulum on a cart. The project leverages the acados solver for high-performance numerical optimization and CasADi for algorithmic differentiation, focusing on real-time feasibility and state/input constraints."
---
This project explores the use of **acados** to solve real-time optimal control problems. I modeled the nonlinear dynamics of the inverted pendulum and designed an NMPC controller capable of managing actuator constraints, ensuring system stability even in the presence of disturbances.