clear
clc

% Td_0 = 5/9*([195 212 204 204 84]-32);
% Ta_0 = 5/9*([79.6 80.7 81.6 79.3 63.6]-32);
% flow = [29.9 27.1 22.8 26.5 15.5];
% RH_WB = 5/9*([68.9 68.6 69.0 67.6 53.3]-32); % RH or WB
% load = [.98 .98 .98 .99 .94];
% Dd0 = 10.5;

Td_0 = 5/9*([60:20:200]-32);
Ta_0 = 5/9*(80-32) *ones(8);
flow = 60 *ones(8);
RH_WB = 0.5 *ones(8); % RH or WB 
load = 1 *ones(8);
Dd0 = 30;

qWB = 0;

results = zeros(length(Td_0), 13);
% results = [Td_0 Ta_f Dd_f ma_f RH_f row_air time_f AWB]

for i = 1:length(Td_0)
    [Ta_f Dd_f RH_0 row_air mass time_f AWB s_drp s_air h_drp h_air qd qa c_v Dd_v RH_v] = mee_funct(Td_0(i), Ta_0(i), flow(i), load(i), RH_WB(i), Dd0, qWB);
    
    % Td
    % Ta
    % RH
    % row
    % s_drp
    % s_air
    % h_air
    % h_drp
    % h_air
    % Qd
    % Qa
    % Cv
    results(i, :) = [9/5*Td_0(i)+32 9/5*Ta_f+32 Dd_f RH_0 row_air mass s_drp/10^3 s_air h_drp/10^6 h_air/10^3 qd/10^6 qa/10^3 c_v];
end

results

Td = results(:, 1);
Ta = results(:, 2);
Dd = results(:, 3);
RH0 = results(:, 4);
row = results(:, 5);
mass = results(:, 6);
Sd = results(:, 7);
Sa = results(:, 8);
Hd = results(:, 9);
Ha = results(:, 10);
Qd = results(:, 11);
Qa = results(:, 12);
Cv = results(:, 13);

(Td(8)-Td(1))/(Ta(8)-Ta(1))

Ta_act = [71.7; 72.4; 73.0; 71.7; 56.7];

pe = abs(Ta - Ta_act)./Ta_act
mean(pe)

% % original
% 
% O2 = 0.2;
% N2 = 0.8;
% 
% airflow2 = 3900000/2.2/3600; % kg/s
% Ng_flow2 = (O2/2).*airflow2; % kg/s
% Hc = 54*10^6*Ng_flow2;
% 
% CO2 = (Ng_flow2 + O2*airflow2)/(3*(Ng_flow2 + airflow2));
% Cv2 = 2*(Ng_flow2 + O2*airflow2)/(3*(Ng_flow2 + airflow2));
% N2 = N2*airflow2/(Ng_flow2 + airflow2);
% 
% Cex = 839*CO2 + 1040*N2 + 1880*Cv2;
% Cin = 1012;
% Qex = (airflow2+Ng_flow2).*Cex.*760;
% Qin = airflow2.*Cin.*(Ta_0+273.15);
% 
% eff2 = 1 - Qex/(Qin+Hc)
% 
% % compared to
% 
% O2 = (1-Cv)/5;
% N2 = 4*O2;
% 
% airflow = 3900000/2.2/3600*(1+mass).*(1+row); % kg/s
% Ng_flow = (O2/2).*airflow; % kg/s
% Hc = 54*10^6*Ng_flow;
% 
% CO2 = 1/3*(Ng_flow + O2.*airflow)./(Ng_flow + airflow);
% Cv1 = (2/3*(Ng_flow + O2.*airflow) + Cv.*airflow)./(Ng_flow + airflow);
% N2 = N2.*airflow./(Ng_flow + airflow);
% 
% Cex = 839*CO2 + 1040*N2 + 1880*Cv1;
% Cin = 1012;
% Qex = (airflow+Ng_flow).*Cex.*760;
% Qin = airflow.*(Cin.*(Ta+273.15) + Ha);
% 
% eff = 1 - Qex./(Qin+Hc);
% [eff, 215*(1+mass).*(1+row).*eff/eff2]