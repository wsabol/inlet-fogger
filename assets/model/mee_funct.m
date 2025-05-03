function [Ta_f Dd_f RH_0 row_air mass time_f AWB s_drp s_air h_drp h_air Qd Qa c_v Dd_v RH_v] = mee_funct(Td_0, Ta_0, flow_water, load, RH_WB, Dd0, qWB)
    %% Constants

    g = 9.80665; % m/s/s
    M_water = 0.01801528; % kg/mol water molar mass
    M_da = .0289652; % kg/mol dry air molar mass
    R = 8.314472; % J/mol/K
    k = 1.3806505*10^-23; % J/K % Boltzman Constant
    k_water = 0.58; % W/m/K

    flow_water = flow_water*8.34*60;
    flow_air = 3900000*load; % pph
    mixing_ratio = flow_water/flow_air; % water[mass] / air[mass]

    delta_t = 0.0001;
    t_max = 1.5;

    %% Intital Conditions
    
    i = 1;
    Ta = Ta_0 +273.15; % K
    Td = Td_0 +273.15; % K
    Dd = Dd0*10^-6; % m
    s_air = 0;
    s_drp = 0;
    h_air = 0;
    h_drp = 0;
    
    if qWB == 1 % WB temp is prescribed rather than RH
        RH_WB = RH_WB + 273.15;
        Ew = 611.21*exp((19.8428 - RH_WB/234.5) * (RH_WB-273.15) / (RH_WB-16.01)); % Pa
        Es = 611.21*exp((19.8428 - Ta/234.5) * (Ta-273.15) / (Ta-16.01)); % Pa
        E = Ew - 101325*(Ta-RH_WB)*.00066*(1+0.00115*(RH_WB-273.15));
        RH = E/Es;
    else
        RH = RH_WB;
    end
    RH_0 = RH;
    
    row_water = -0.0036*Td^2 + 1.9102*Td + 747.2; % kg/m^3
    md0 = row_water * 4/3 * pi * (Dd/2)^3; % kg % initial mass of droplet
    ma0 = md0/mixing_ratio; % kg % inital mass of air
    ma = ma0; % kg
    
    Psat = 611.21*exp((19.8428 - Ta/234.5) * (Ta-273.15) / (Ta-16.01)); % Pa % saturation vapor pressure % Arden Buck equation
    Pvap = RH*Psat; % Pa % partial pressure of water in humid air
    row_wv = Pvap*M_water/R/Ta;
    row_da = -0.0041845*Ta + 2.4325; % kg/m^3
    Pda = row_da*R*Ta/M_da; % partial pressure of dry air in humid air
    SH = 0.622*Pvap/Pda; % absolute humidity
    c_a = 1/(1+SH); % mass concentration of dry air
    c_v = 1 - c_a; % mass concentration of water vapor
    row0 = c_a*row_da + c_v*row_wv; % kg/m^3 % density of wet air
    m_da = c_a*ma; % kg % mass of dry air (non water coumpounds in air)
    Ptot = Pvap + Pda;
    
    C_da = 981 + 0.08*Ta; % J/kg/K % specific heat of dry air
    C_wv = 1772 + 0.312*Ta; % J/kg/K % specific heat of water vapor
    Ca = c_a*C_da + c_v*C_wv;
    Cd = 2.628*10^-6*(Td-273.15)^4 - 0.000651*(Td-273.15)^3 + 0.0659*(Td-273.15)^2 - 2.6567*(Td-273.15) + 4214.5;
    Qd = Cd*Td;
    Qa = Ca*Ta;
    
    Dd_ = Dd;
    RH_ = RH;
    
    for t = delta_t:delta_t:t_max

        %% Calculate air characteristics

        k_air = (46.766 + 0.7143*Ta)*10^-4; % W/m/K % thermal conductivity
        miu_air = 1.512*10^(-6) * Ta^(3/2) / (Ta+120); % kg/m/s % dynamic viscocity
        row_da = 2.3723 - 0.00397*Ta; % kg/m^3 % density of dry air
        Pda = row_da*R*Ta/M_da; % partial pressure of dry air in humid air

        %% Psychrometrics

        Psat = 611.21*exp((19.8428 - Ta/234.5) * (Ta-273.15) / (Ta-16.01)); % Pa % saturation vapor pressure % Arden Buck equation
        Pvap = SH*Pda/0.622; % Pa % Partial pressure of water vapor
        row_wv = Pvap*M_water/R/Ta;
        
        Ptot1 = Pvap + Pda;
        dP = (Ptot1 - Ptot)/delta_t;
        Ptot = Ptot1;
        
        c_a = 1/(1+SH); % mass concentration of dry air
        c_v = 1 - c_a; % mass concentration of water vapor
        row = c_a*row_da + c_v*row_wv; % kg/m^3 % density of wet air
        delta_a = 2.26*10^-5*101325*Ta/Ptot/273.15; % m^2/s % mass diffusion coeff
        
        C_da = 0.000402*Ta^2 - 0.2026*Ta + 1030.9; % J/kg/K % specific heat of dry air
        C_wv = 1772 + 0.312*Ta; % J/kg/K % specific heat of water vapor
        Ca = c_a*C_da + c_v*C_wv;

        %% Calcualte droplet characteristics

        row_water = 786.5 + 1.681*Td - 0.003272*Td^2; % kg/m^3
        Sd = 4 * pi * (Dd/2)^2; % m^2 % surface area of droplet
        md = row_water * 4/3 * pi * (Dd/2)^3;
        Lv = Psat*Td*(R*Td/M_water/Psat - 1/row_water)*(1192134+32.02*Td-Td^2)/(234.5*(Td-16.01)^2); % J/kg % latent heat of water vapor
        Cd = -0.000099*Td^3 + 0.10913*Td^2 - 39.178*Td + 8785.4; % J/kg/K
        
        %% Heat transfer process

        Pr = miu_air * Ca / k_air; % Prandtl number
        beta = 1 / Ta; % thermal dilatation coefficient
        Gr_t = row^2*g*beta*abs(Ta - Td)*Dd^3 / miu_air^2; % thermal Grashof number
        Nu = 2 + 0.6 * Gr_t^0.25 * Pr^0.33; % Nusselt number
        h_cv = Nu * k_air / Dd; % W/m^2/K % thermal conductivity

        %% Mass Tranfer process

        ST = 2.1*10^-7*(row_water/M_water)^(2/3)*(647.10 - Td);
        %P_knd = 611.21*exp((19.8428 - Td/234.5) * (Td-273.15) / (Td-16.01)); % Saturation pressure at Knudsen Layer
        P_knd = Psat*exp(4*ST*M_water/R/Td/Dd/row_water);
        row_knd = M_water*P_knd/R/Td; % kg/m^3 % mass density concentration at saturation
        beta_m = c_v/row;
        Gr_m = row^2*g*beta_m*abs(row_wv - row_knd)*Dd^3 / miu_air^2; % mass transfer Grashof number
        Sc = miu_air / row / delta_a; % Schmidt number
        Sh = 2 + 0.6 * Gr_m^0.25 * Sc^0.33; % Sherwood number: mass transfer Nusselt number
        Cmass = row_wv - row_knd; % kg/m^3 % "diving force": mass density difference between current and saturated states
        K_mass = Sh*delta_a/Dd; % m/s % mass transfer coefficient
        mass_flux = K_mass*Cmass; % kg/m^2/s % mass rate flux

        %% Lumped Capacitance - Biot numbers
        
        Bi_a = h_cv*Dd/6/k_air;
        Bi_d = h_cv*Dd/6/k_water;
        Bi_m = K_mass*Dd/6/delta_a;
        
        %% Calculate Differentials

        dmd = Sd*mass_flux; % kg/s
        dma = -Sd*mass_flux; % kg/s
        
        dC_da = 0.000804*Ta - 0.2026; % J/kg/K^2
        dC_wv = 0.312; % J/kg/K^2
        dCd = -3*0.000099*Td^2 + 2*0.10913*Td - 39.178; % J/kg/K^2
        
        dTd = (h_cv*Sd*(Ta - Td) + Sd*Lv*mass_flux - dmd*Cd*Td)/(md*(Cd + dCd*Td)); % K/s
        dTa = (h_cv*Sd*(Td - Ta) - dma*Ta*(Ca + c_a*(C_wv-C_da)))/(ma*(Ca + Ta*(dC_da*c_a+dC_wv*c_v))); % K/s
        
        dQd = dCd*dTd*Td + Cd*dTd; % J/kg/s
        dQa = ((dC_da*c_a+dC_wv*c_v)*dTa + dma/m_da*c_a^2*(C_wv-C_da))*Ta + Ca*dTa; % J/kg/s
        
        ds_d = dQd/Td; % J/kg/K/s
        ds_a = dQa/Ta; % J/kg/K/s
        dh_d = Td*ds_d + dP/row_water; % J/kg/s
        dh_a = Ta*ds_a + dP/row; % J/kg/s

        %% Calculate new values

        Td = Td + delta_t*dTd;
        Ta = Ta + delta_t*dTa;
        Ta = (Ta*ma + Td*delta_t*dma)/(ma + delta_t*dma);
        md = md + delta_t*dmd;
        ma = ma + delta_t*dma;

        Qd = Qd + delta_t*dQd;
        Qa = Qa + delta_t*dQa;
        
        s_drp = s_drp + delta_t*ds_d;
        s_air = s_air + delta_t*ds_a;
        h_drp = h_drp + delta_t*dh_d;
        h_air = h_air + delta_t*dh_a;
        
        Dd = 2*(3*md/4/pi/row_water)^(1/3);
        SH = (ma - m_da)/m_da;
        RH = Pvap/Psat;

        %% Push values to Vectors

        i = i + 1;
        Td_(i) = Td;
        Dd_(i) = Dd;
        RH_(i) = RH;
        
        %% Check Knudsen Number

        mfp = k * Td / ( sqrt(2) * pi * (2.75*10^-10)^2 * Ptot); % m % layer thickness
        Kn = 2 * mfp / Dd;
        if Kn > 0.08
            break;
        end
        
        %D_c = 4*ST*M_water/R/row_water/Td/log(RH)
        
    end

    %% Return Results

    Ta_f = Ta-273.15;
    Dd_f = Dd*10^6;
%     RH_f = RH*100;
    time_f = delta_t*(i-1);
    mass = (ma - ma0) / ma;
    row_air = (row - row0) / row0;
    AWB = -Lv*mass_flux/h_cv;
    Dd_v = Dd_*10^6;
    RH_v = RH_*100;
end