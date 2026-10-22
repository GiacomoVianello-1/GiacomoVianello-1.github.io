---
layout: post
title: "NMPC for Inverted Pendulum on a Cart using Acados"
author: "Giacomo Vianello"
authors: Giacomo Vianello
categories: Research
image: /images/pendulum.gif
code: https://github.com/GiacomoVianello-1/NMPC-Inverted-Pendulum-Acados
poster: /pdfs/NMPC_Inverted_Pendulum.pdf
venue: Adaptive and Model Predictive Control - University of Padova
abstract: "A real-time Nonlinear Model Predictive Control (NMPC) formulation for the swing-up and stabilization of an inverted pendulum on a cart, implemented using acados and CasADi. The controller utilizes the Real-Time Iteration (RTI) scheme to solve constrained nonlinear optimal control problems at high frequencies. An extended state formulation penalizes control jerk for smooth actuator transitions, while robustness analyses under parameter mismatches and horizon variations highlight NMPC's superiority over standard linear MPC."
---
Real-time NMPC for inverted pendulum swing-up and stabilization using acados and CasADi, with jerk penalty and robustness analysis.