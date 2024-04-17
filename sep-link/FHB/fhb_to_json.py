import itertools
import json

filename = 'fhb_raw.tsv'
info = {}
info['total_rows'] = 0
info['offset'] = 0
info['rows'] = []

# 0/line 1: ipa (export as ipa)
# 1/line 2: orthography (export as gloss)
# 2/line 3: en gloss
# 3/line 4: fr gloss
# 4/line 5: en trans
# 5/line 6: fr trans
# 6/line 7: timestamps

sentence_id = 0

with open(filename) as f:
    while True:
        # get lines in groups of 8 (last line is newline character)
        group = list(itertools.islice(f, 8))
        if not group: # error checking
            break

        # cleaning: remove tab and newline characters
        group = [line.replace('\t', ' ').replace('\n', '') for line in group[:7]] 

        sentence_info = {}
        sentence_info['id'] = str(sentence_id)
        # TODO: currently hardcoding story id
        sentence_info['key'] = ['1', sentence_id, str(sentence_id)]
        # key: [story id, number(?), sentence id]
        # TODO: find out what second element is
        s = {
          "judgement": "",
          "utterance": group[4],
          "morphemes": group[0],
          "orthography": group[1],
          "gloss": group[2],
          "gloss_fr": group[3],
          "translation": group[4],
          "french": group[5],
          "timestamps": group[6],
          "tags": "",
        #   "syntacticCategory": group[2],
          "syntacticTreeLatex": "",
          "validationStatus": "",
          "enteredByUser": "",
          "modifiedByUser": ""
        }
        sentence_info['value'] = {'story': '1', 'sentence': s}

        info['total_rows'] += 1
        info['rows'].append(sentence_info)
        sentence_id += 1


with open('fhb_sentences.json', 'w', encoding='utf-8') as f:
    json.dump(info, f, ensure_ascii=False, indent=4)