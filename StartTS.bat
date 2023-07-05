if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )
ts-node main.ts
