fetch('https://knls.ac.ke/').then(r => r.text()).then(t => { const m = t.match(/https:\/\/[^"'>]*logo[^"'>]*\.(png|svg|jpg)/gi); console.log(m ? m[0] : "no match"); });
